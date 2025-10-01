/* ---------- configuration ---------- */
const config = {
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4100/api',
  logLevel: 'verbose', // 'silent', 'normal', 'verbose'
  adminEmail: process.env.ADMIN_EMAIL || 'admin1@planteshop.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'password',
};

/* ---------- utilitaires HTTP ---------- */
async function hit(method, route, expectedStatus, body, token) {
  const url = `${config.apiBaseUrl}${route}`;
  const label = `${method} ${route}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const success = res.status === expectedStatus;

    if (config.logLevel !== 'silent') {
      console.log(`${success ? '✅' : '❌'} ${label} [${res.status}]`);
    }

    if (!success) {
      const txt = await res.text();
      throw new Error(
        `API ${label} → ${res.status} (attendu ${expectedStatus})\n${txt}`
      );
    }
    try {
      return await res.json();
    } catch {
      return {};
    }
  } catch (err) {
    if (err.message.includes('fetch failed')) {
      console.error(`❌ Connection error: ${url} - API down ?`);
    }
    throw err;
  }
}

function assertEq(obj, key, expected) {
  const actual = obj[key];
  const ok = actual === expected;
  if (config.logLevel !== 'silent') {
    console.log(
      `${ok ? '✅' : '❌'}   ↳ ${key}=${actual} (attendu ${expected})`
    );
  }
  if (!ok)
    throw new Error(
      `Assertion failed: ${key} = ${actual}, expected ${expected}`
    );
}

/* ------------ helpers  ------------ */
async function login(email, password) {
  const { access_token } = await hit('POST', '/auth/login', 201, {
    email,
    password,
  });
  return access_token;
}

async function registerUser(name, email, password) {
  await hit('POST', '/auth/register', 201, { name, email, password });
  return login(email, password);
}

async function findUserIdByEmail(adminToken, email) {
  const users = await hit('GET', '/users', 200, null, adminToken);
  const u = users.find((usr) => usr.email === email);
  if (!u) throw new Error(`User ${email} not found in admin list`);
  return u.id;
}

/* ---------- modules de test ---------- */
async function testPlants(adminToken) {
  console.log('\n📌 TEST MODULE: PLANTS (admin)');
  const plantData = { name: 'Test Plant', price: 10, stock: 5 };
  const { id: plantId } = await hit(
    'POST',
    '/plants',
    201,
    plantData,
    adminToken
  );
  assertEq(
    await hit('GET', `/plants/${plantId}`, 200, null, adminToken),
    'name',
    plantData.name
  );
  await hit('PATCH', `/plants/${plantId}`, 200, { price: 15 }, adminToken);
  assertEq(
    await hit('GET', `/plants/${plantId}`, 200, null, adminToken),
    'price',
    15
  );
  await hit('DELETE', `/plants/${plantId}`, 200, null, adminToken);
  return { success: true };
}

async function testUsers(adminToken) {
  console.log('\n📌 TEST MODULE: USERS (admin)');
  const userData = {
    email: `testcrud-${Date.now()}@example.com`,
    name: 'Tester',
    password: 'pass123',
  };
  const { id: userId } = await hit('POST', '/users', 201, userData, adminToken);
  await hit(
    'PATCH',
    `/users/${userId}`,
    200,
    { name: 'Tester Update' },
    adminToken
  );
  assertEq(
    await hit('GET', `/users/${userId}`, 200, null, adminToken),
    'name',
    'Tester Update'
  );
  await hit('DELETE', `/users/${userId}`, 200, null, adminToken);
  return { success: true };
}

async function testOrders(adminToken, userToken) {
  console.log('\n📌 TEST MODULE: ORDERS & ORDER ITEMS');

  // Création d'une plante (admin)
  const plantData = { name: `Test Plant ${Date.now()}`, price: 10, stock: 5 };
  const { id: plantId } = await hit(
    'POST',
    '/plants',
    201,
    plantData,
    adminToken
  );

  // Création commande par l'utilisateur
  const orderPayload = { items: [{ plantId, quantity: 2 }] };
  const { id: orderId } = await hit(
    'POST',
    '/orders',
    201,
    orderPayload,
    userToken
  );

  // L'admin modifie le statut
  await hit(
    'PATCH',
    `/orders/${orderId}`,
    200,
    { status: 'shipped' },
    adminToken
  );

  // Vérification via la liste des commandes de l'utilisateur (pas de route show)
  const commandes = await hit('GET', '/orders', 200, null, userToken);
  const commande = commandes.find((o) => o.id === orderId);
  if (!commande) throw new Error(`Commande ${orderId} introuvable`);
  assertEq(commande, 'status', 'shipped');

  // Nettoyage
  await hit('DELETE', `/orders/${orderId}`, 200, null, adminToken);
  await hit('DELETE', `/plants/${plantId}`, 200, null, adminToken);

  return { success: true };
}


async function testUserProfile(adminToken, userToken, userEmail) {
  console.log('\n📌 TEST MODULE: USER PROFILE (user)');
  const userId = await findUserIdByEmail(adminToken, userEmail);

  // L’utilisateur peut consulter son profil
  assertEq(
    await hit('GET', `/users/${userId}`, 200, null, userToken),
    'id',
    userId
  );

  // L’utilisateur peut mettre à jour son propre profil
  const nouveauNom = `UserModif-${Date.now()}`;
  await hit('PATCH', `/users/${userId}`, 200, { name: nouveauNom }, userToken);
  assertEq(
    await hit('GET', `/users/${userId}`, 200, null, userToken),
    'name',
    nouveauNom
  );

  // Vérif sécurité : il ne peut pas se donner admin
  await hit('PATCH', `/users/${userId}`, 200, { admin: true }, userToken);
  const profil = await hit('GET', `/users/${userId}`, 200, null, adminToken);
  assertEq(profil, 'admin', false);
}

async function testAuthRoles(adminToken, userToken) {
  console.log('\n📌 TEST MODULE: ROLES');

  // User tente création de plante → 403
  await hit(
    'POST',
    '/plants',
    403,
    { name: 'Bad', price: 1, stock: 1 },
    userToken
  );

  // Admin crée plante → 201 puis suppr
  const { id: pid } = await hit(
    'POST',
    '/plants',
    201,
    { name: 'Good', price: 1, stock: 1 },
    adminToken
  );
  await hit('DELETE', `/plants/${pid}`, 200, null, adminToken);

  // User tente accès /users → 403
  await hit('GET', '/users', 403, null, userToken);

  return { success: true };
}

async function testAdminPlants(adminToken) {
  console.log('\n📌 TEST MODULE: ADMIN PLANTS');
  const plantes = await hit('GET', '/admin/plants', 200, null, adminToken);
  console.log(`   ↳ ${plantes.length} plantes récupérées`);

  // --- Test POST /admin/plants ---
  const planteAdmin = {
    name: `AdminTestPlant-${Date.now()}`,
    price: 99,
    stock: 12,
  };
  const { id: planteAdminId } = await hit(
    'POST',
    '/admin/plants',
    201,
    planteAdmin,
    adminToken
  );
  assertEq(
    await hit('GET', `/plants/${planteAdminId}`, 200, null, adminToken),
    'name',
    planteAdmin.name
  );

  // --- Test PATCH /admin/plants/:id ---
  const prixModifie = 123;
  await hit(
    'PATCH',
    `/admin/plants/${planteAdminId}`,
    200,
    { price: prixModifie },
    adminToken
  );
  assertEq(
    await hit('GET', `/plants/${planteAdminId}`, 200, null, adminToken),
    'price',
    prixModifie
  );

  // --- Nettoyage ---
  await hit('DELETE', `/plants/${planteAdminId}`, 200, null, adminToken);

  return { success: true };
}

async function testAdminUsers(adminToken) {
  console.log('\n📌 TEST MODULE: ADMIN USERS');
  const utilisateurs = await hit('GET', '/admin/users', 200, null, adminToken);
  console.log(`   ↳ ${utilisateurs.length} utilisateurs récupérés`);

  // --- Test PATCH /admin/users/:id ---
  const utilisateur = utilisateurs[0];
  const nomModifie = `AdminModif-${Date.now()}`;
  await hit(
    'PATCH',
    `/admin/users/${utilisateur.id}`,
    200,
    { name: nomModifie },
    adminToken
  );
  assertEq(
    await hit('GET', `/users/${utilisateur.id}`, 200, null, adminToken),
    'name',
    nomModifie
  );

  return { success: true };
}

/* ---------- exécution des tests ---------- */
async function main() {
  console.log(`🧪 Démarrage des tests: ${config.apiBaseUrl}\n`);

  try {
    // auth tokens
    const adminToken = await login(config.adminEmail, config.adminPassword);
    const userEmail = `user-${Date.now()}@example.com`;
    const userToken = await registerUser('User', userEmail, 'pass123');

    await testPlants(adminToken);
    await testUsers(adminToken);
    await testOrders(adminToken, userToken);
    await testUserProfile(adminToken, userToken, userEmail);
    await testAuthRoles(adminToken, userToken);
    await testAdminPlants(adminToken);
    await testAdminUsers(adminToken);

    console.log('\n🎉 Tous les tests ont réussi!');
    return 0;
  } catch (err) {
    console.error(`\n❌ Tests interrompus: ${err.message}`);
    return 1;
  }
}

if (require.main === module) {
  main().then((code) => process.exit(code));
} else {
  module.exports = {
    runTests: main,
    utils: { hit, assertEq, login },
  };
}
