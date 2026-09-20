const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Direito", description: "Legislação, jurisprudência e prática jurídica" },
  { name: "Matemática", description: "Álgebra, geometria, cálculo e estatística" },
  { name: "Português", description: "Gramática, interpretação de texto e redação" },
  { name: "Informática", description: "Tecnologia, programação e ferramentas digitais" },
  { name: "Atualidades", description: "Eventos, política e sociedade contemporânea" },
];

async function main() {
  for (const cat of CATEGORIES) {
    const existing = await prisma.category.findUnique({ where: { name: cat.name } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`✅ Categoria criada: ${cat.name}`);
    } else {
      console.log(`⏭️  Categoria já existe: ${cat.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
