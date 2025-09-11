// # Importations
import { PrismaClient } from "@prisma/client";
import type { User, Plant } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// # Données
const NB_ADMINS = 3;
const NB_USERS = 20;
const NB_PLANTS = 60;
const MAX_ORDERS_PER_USER = 7;
const PLANT_NAMES = [
	"Rose",
	"Tulipe",
	"Lavande",
	"Orchidée",
	"Basilic",
	"Menthe",
	"Pivoine",
	"Tournesol",
	"Cactus (Echinopsis)",
	"Bambou",
	"Camomille (Matricaria recutita)",
	"Sauge (Salvia officinalis)",
	"Romarin (Rosmarinus officinalis)",
	"Thym (Thymus vulgaris)",
	"Laurier-rose (Nerium oleander)",
	"Aloe vera",
	"Jasmin (Jasminum officinale)",
	"Hortensia (Hydrangea macrophylla)",
	"Marguerite (Leucanthemum vulgare)",
	"Géranium (Pelargonium graveolens)",
	"Fuchsia (Fuchsia magellanica)",
	"Anémone (Anemone coronaria)",
	"Azalée (Rhododendron simsii)",
	"Chrysanthème (Chrysanthemum morifolium)",
	"Digitale pourpre (Digitalis purpurea)",
	"Glaïeul (Gladiolus hortulanus)",
	"Lys (Lilium candidum)",
	"Violette (Viola odorata)",
	"Muguet (Convallaria majalis)",
	"Iris (Iris germanica)",
	"Lavandin (Lavandula intermedia)",
	"Érable du Japon (Acer palmatum)",
	"Citronnelle (Cymbopogon citratus)",
	"Pin parasol (Pinus pinea)",
	"Cyprès (Cupressus sempervirens)",
	"Olivier (Olea europaea)",
	"Papyrus (Cyperus papyrus)",
	"Figuier (Ficus carica)",
	"Eucalyptus (Eucalyptus globulus)",
	"Acacia (Acacia dealbata)",
	"Bégonia (Begonia semperflorens)",
	"Calathea (Calathea ornata)",
	"Dieffenbachia (Dieffenbachia seguine)",
	"Ficus elastica",
	"Sansevieria (Sansevieria trifasciata)",
	"Philodendron (Philodendron scandens)",
	"Yucca (Yucca elephantipes)",
	"Zamioculcas zamiifolia",
	"Monstera deliciosa",
	"Pothos (Epipremnum aureum)",
	"Agave (Agave americana)",
	"Cactus raquette (Opuntia ficus-indica)",
	"Palmier-dattier (Phoenix dactylifera)",
	"Amaryllis (Hippeastrum hybridum)",
	"Bleuet (Centaurea cyanus)",
	"Cœur-de-Marie (Lamprocapnos spectabilis)",
	"Croton (Codiaeum variegatum)",
	"Dracaena (Dracaena marginata)",
	"Hosta (Hosta plantaginea)",
	"Lierre (Hedera helix)",
	"Mimosa (Acacia dealbata)",
];

// # Classe SeedService
class SeedService {
	private prisma = new PrismaClient();

	// ## Reset
	private reset = async (): Promise<void> => {
		await this.prisma.orderItem.deleteMany();
		await this.prisma.order.deleteMany();
		await this.prisma.plant.deleteMany();
		await this.prisma.user.deleteMany();
	};

	// ## Admins
	private createAdmins = async () => {
		const admins: { email: string; password: string }[] = [];
		for (let idx = 0; idx < NB_ADMINS; idx++) admins.push(await this.addAdmin(idx));
		return admins;
	};

	private addAdmin = async (index: number) => {
		const email = `admin${index + 1}@planteshop.com`;
		const password = "password";
		await this.prisma.user.create({
			data: {
				email,
				password: await bcrypt.hash(password, 10),
				admin: true,
				// Utiliser des noms générés statiquement pour éviter les problèmes de faker
				name: `Admin ${index + 1}`,
			},
		});
		return { email, password };
	};

	// ## Users
	private createUsers = async () => {
		const users: { email: string; password: string }[] = [];
		for (let idx = 0; idx < NB_USERS; idx++) users.push(await this.addUser(idx));
		return users;
	};

	private addUser = async (index: number) => {
		// Générer des mots de passe manuellement pour éviter les problèmes de faker
		const password = `password${index + 1}`;
		const email = `user${index + 1}@example.com`;
		await this.prisma.user.create({
			data: {
				email,
				password: await bcrypt.hash(password, 10),
				admin: false,
				name: `Utilisateur ${index + 1}`,
			},
		});
		return { email, password };
	};

	// ## Plants
	private createPlants = async () => {
		const max = PLANT_NAMES.length;
		const plants: Plant[] = [];
		for (let idx = 0; idx < NB_PLANTS; idx++) plants.push(await this.addPlant(idx, max));
		return plants;
	};

	private addPlant = async (idx: number, max: number) => {
		const base = PLANT_NAMES[idx % max];
		const name = NB_PLANTS > max ? `${base} ${Math.floor(idx / max) + 1}` : base;
		return this.prisma.plant.create({
			data: {
				name,
				// Utiliser Math.random au lieu de faker pour générer des nombres aléatoires
				price: Math.floor(Math.random() * 46) + 5, // Entre 5 et 50
				description: `Description de ${name} avec des détails sur l'entretien et la croissance.`,
				stock: Math.floor(Math.random() * 26) + 5, // Entre 5 et 30
			},
		});
	};

	// ## Orders
	private createOrders = async (plants: Plant[]) => {
		for (const user of await this.prisma.user.findMany()) {
			const numberOfOrders = Math.floor(Math.random() * (MAX_ORDERS_PER_USER + 1)); // Entre 0 et MAX_ORDERS_PER_USER
			for (let idx = 0; idx < numberOfOrders; idx++) {
				await this.createOrderForUser(user, plants);
			}
		}
	};

	private createOrderForUser = async (user: User, plants: Plant[]) => {
		let total = 0;
		const statuses = ["confirmed", "pending", "shipped", "delivered"];
		const randomStatusIndex = Math.floor(Math.random() * statuses.length);
		const order = await this.prisma.order.create({
			data: {
				userId: user.id,
				totalPrice: 0,
				status: statuses[randomStatusIndex],
			},
		});
		for (let iter = 0; iter < 2; iter++) total += await this.addItem(order.id, plants);
		await this.prisma.order.update({ where: { id: order.id }, data: { totalPrice: total } });
	};

	private addItem = async (orderId: number, plants: Plant[]) => {
		const plant = plants[Math.floor(Math.random() * plants.length)];
		if (!plant.stock) return 0;
		const qty = Math.min(Math.floor(Math.random() * 5) + 1, plant.stock); // Entre 1 et 5
		if (!qty) return 0;
		await this.prisma.orderItem.create({ data: { orderId, plantId: plant.id, quantity: qty } });
		await this.prisma.plant.update({ where: { id: plant.id }, data: { stock: plant.stock - qty } });
		plant.stock -= qty;
		return plant.price * qty;
	};

	// ## users.txt
	private writeUsersFile = (admins: { email: string; password: string }[], users: { email: string; password: string }[]) => {
		const path = join(process.cwd(), "users.txt");
		let txt = "Administrateurs :\n\n";
		admins.forEach((admin) => (txt += `${admin.email} ${admin.password}\n`));
		txt += "\nUtilisateurs :\n\n";
		users.forEach((u) => (txt += `${u.email} ${u.password}\n`));
		writeFileSync(path, txt, "utf8");
	};

	// # Main
	public run = async (): Promise<void> => {
		await this.reset();
		const admins = await this.createAdmins();
		const users = await this.createUsers();
		const plants = await this.createPlants();
		this.writeUsersFile(admins, users);
		await this.createOrders(plants);
		console.log("✅ Seed terminée. Données créées & users.txt généré.");
		await this.prisma.$disconnect();
	};
}

// # Lancement
new SeedService().run().catch((err) => {
	console.error(err);
	process.exit(1);
});
