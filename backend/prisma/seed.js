const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding do banco de dados...');

  // 1. Popular ServiceCategory (Categorias de Serviço)
  const categories = [
    {
      id: 1,
      niche: 'general',
      name: 'Atendimento Geral / Avaliação Inicial',
      description: 'Atendimento inicial padrão para captação de leads',
    },
    {
      id: 2,
      niche: 'psychologist',
      name: 'Psicoterapia Individual',
      description: 'Atendimento clínico individual para adultos',
    },
    {
      id: 3,
      niche: 'psychologist',
      name: 'Terapia de Casal',
      description: 'Consultas com foco em relacionamentos',
    },
    {
      id: 4,
      niche: 'caregiver',
      name: 'Acompanhamento de Idosos',
      description: 'Apoio diário e assistência domiciliar de idosos',
    },
    {
      id: 5,
      niche: 'caregiver',
      name: 'Cuidador de Convalescentes',
      description: 'Assistência a pacientes em recuperação pós-cirúrgica ou tratamento',
    },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { id: cat.id },
      update: {
        niche: cat.niche,
        name: cat.name,
        description: cat.description,
      },
      create: cat,
    });
  }
  console.log('Categorias de serviço populadas com sucesso!');

  // 2. Popular SubscriptionPlan (Planos de Assinatura)
  const plans = [
    {
      id: 1,
      name: 'Plano Básico',
      priceMonthly: 49.90,
      featuresJson: JSON.stringify(['landing_pages']),
      isActive: true,
    },
    {
      id: 2,
      name: 'Plano Profissional',
      priceMonthly: 99.90,
      featuresJson: JSON.stringify(['landing_pages', 'crm', 'ai_suggestions']),
      isActive: true,
    },
    {
      id: 3,
      name: 'Plano Premium',
      priceMonthly: 199.90,
      featuresJson: JSON.stringify(['landing_pages', 'crm', 'ai_suggestions', 'whatsapp_automation']),
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        featuresJson: plan.featuresJson,
        isActive: plan.isActive,
      },
      create: plan,
    });
  }
  console.log('Planos de assinatura populados com sucesso!');

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
