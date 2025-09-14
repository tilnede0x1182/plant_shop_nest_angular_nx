// test_complet.js

/* ---------- configuration ---------- */
// Utiliser la configuration à partir des variables d'environnement avec des valeurs par défaut
const config = {
  apiBaseUrl: process.env.DATABASE_URL || 'http://localhost:4100',
  logLevel: 'verbose', // 'silent', 'normal', 'verbose'
};

/* ---------- utilitaires ---------- */
async function hit(method, route, expectedStatus, body) {
  const url = `${config.apiBaseUrl}${route}`;
  const label = `${method} ${route}`;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const success = res.status === expectedStatus;

    if (config.logLevel !== 'silent') {
      console.log(`${success ? '✅' : '❌'} ${label} [${res.status}]`);
    }

    if (!success) {
      const responseText = await res.text();
      console.error(
        `API responded with ${res.status}, expected ${expectedStatus}`
      );
      console.error(`Response: ${responseText}`);
      throw new Error(`API request failed: ${label}`);
    }

    try {
      return await res.json();
    } catch (e) {
      return {};
    }
  } catch (error) {
    if (error.message.includes('fetch failed')) {
      console.error(`❌ Connection error: ${url} - Is the API running?`);
    }
    throw error;
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

  if (!ok) {
    throw new Error(
      `Assertion failed: ${key} = ${actual}, expected ${expected}`
    );
  }
}

/* ---------- modules de test ---------- */
async function testPlants() {
  console.log('\n📌 TEST MODULE: PLANTS');
  const plantData = { name: 'Test Plant', price: 10, stock: 5 };
  const { id: plantId } = await hit('POST', '/plants', 201, plantData);
  assertEq(await hit('GET', `/plants/${plantId}`, 200), 'name', plantData.name);
  await hit('PATCH', `/plants/${plantId}`, 200, { price: 15 });
  assertEq(await hit('GET', `/plants/${plantId}`, 200), 'price', 15);
  await hit('DELETE', `/plants/${plantId}`, 200);
  return { success: true };
}

async function testUsers() {
  console.log('\n📌 TEST MODULE: USERS');
  const userData = {
    email: `testcrud-${Date.now()}@example.com`, // Éviter les conflits avec des tests précédents
    name: 'Tester',
    password: 'pass123',
  };
  const { id: userId } = await hit('POST', '/users', 201, userData);
  await hit('PATCH', `/users/${userId}`, 200, { name: 'Tester Update' });
  assertEq(await hit('GET', `/users/${userId}`, 200), 'name', 'Tester Update');
  await hit('DELETE', `/users/${userId}`, 200);
  return { success: true, userData };
}

async function testOrders() {
  console.log('\n📌 TEST MODULE: ORDERS & ORDER ITEMS');
  // Créer les données de test
  const plantData = { name: `Test Plant ${Date.now()}`, price: 10, stock: 5 };
  const userData = {
    email: `testorder-${Date.now()}@example.com`,
    name: 'Order Tester',
    password: 'pass123',
  };

  // Créer plante et utilisateur pour les tests
  const { id: plantId } = await hit('POST', '/plants', 201, plantData);
  const { id: userId } = await hit('POST', '/users', 201, userData);

  try {
    // Test d'ordre
    const orderPayload = {
      userId,
      items: [{ plantId, quantity: 2 }],
    };
    const { id: orderId } = await hit('POST', '/orders', 201, orderPayload);
    await hit('PATCH', `/orders/${orderId}`, 200, { status: 'shipped' });
    assertEq(await hit('GET', `/orders/${orderId}`, 200), 'status', 'shipped');
    await hit('DELETE', `/orders/${orderId}`, 200);

    // Test d'échec attendu pour un order-item avec commande supprimée
    try {
      await hit('POST', '/order-items', 500, {
        orderId,
        plantId,
        quantity: 1,
      });
      console.log(
        "✅ Échec attendu pour creation d'order-item avec orderId supprimé"
      );
    } catch (e) {
      console.log(
        '❌ Erreur inattendue lors du test order-item avec orderId supprimé'
      );
    }

    return { success: true };
  } finally {
    // Nettoyage des données créées pour le test
    try {
      await hit('DELETE', `/plants/${plantId}`, 200);
      await hit('DELETE', `/users/${userId}`, 200);
    } catch (e) {
      console.log('⚠️ Nettoyage incomplet des données de test');
    }
  }
}

/* ---------- exécution des tests ---------- */
async function main() {
  console.log(`🧪 Démarrage des tests avec API: ${config.apiBaseUrl}\n`);

  try {
    await testPlants();
    await testUsers();
    await testOrders();

    console.log('\n🎉 Tous les tests ont réussi!');
    return 0;
  } catch (err) {
    console.error(`\n❌ Tests interrompus: ${err.message}`);
    return 1;
  }
}

// Permettre l'exécution directe et l'importation
if (require.main === module) {
  main().then((exitCode) => process.exit(exitCode));
} else {
  module.exports = {
    runTests: main,
    testModules: { testPlants, testUsers, testOrders },
    utils: { hit, assertEq },
  };
}
