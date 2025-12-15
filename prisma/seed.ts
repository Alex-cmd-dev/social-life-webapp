import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create a fake user
  const fakeUser = await prisma.user.upsert({
    where: { email: 'sarah.innovator@example.com' },
    update: {},
    create: {
      email: 'sarah.innovator@example.com',
      name: 'Sarah Innovator',
      username: 'sarah_innovates',
      bio: 'Passionate about EdTech and making learning accessible for everyone! 🎓✨',
      image: 'https://i.pravatar.cc/150?img=5',
      password: await hash('Demo123!', 10), // Demo password
    },
  });

  console.log('✅ Created fake user:', fakeUser.name);

  // Create a fake project
  const fakeProject = await prisma.project.upsert({
    where: { id: 'fake-project-1' },
    update: {},
    create: {
      id: 'fake-project-1',
      title: 'StudyBuddy - AI Study Companion',
      description: 'An AI-powered study companion app that helps students organize their study schedules, create flashcards, and track their learning progress.',
      status: 'IN_PROGRESS',
      userId: fakeUser.id,
    },
  });

  console.log('✅ Created fake project:', fakeProject.title);

  // Create first post about the project
  const post1 = await prisma.post.create({
    data: {
      content: `StudyBuddy - AI Study Companion
I'm excited to share my new project! StudyBuddy is an AI-powered study companion designed to help students stay organized and learn more effectively.

The app features:
- Smart study schedule generation based on your courses and deadlines
- AI-generated flashcards from your notes
- Progress tracking with visual analytics
- Spaced repetition algorithm for optimal retention

Currently building the MVP and would love feedback from fellow students and educators!

#tags: EdTech, AI, Education, Study Tools`,
      userId: fakeUser.id,
      projectId: fakeProject.id,
    },
  });

  console.log('✅ Created post 1:', post1.id);

  // Create second post - project update
  const post2 = await prisma.post.create({
    data: {
      content: `Quick Update on StudyBuddy
Just finished implementing the flashcard generation feature! 🎉

The AI can now scan your study notes and automatically create flashcards with questions and answers. It even groups them by topic and difficulty level.

Next up: Working on the spaced repetition algorithm to help students review at optimal intervals.

What features would you find most useful in a study app?

#tags: Project Update, EdTech, AI`,
      userId: fakeUser.id,
      projectId: fakeProject.id,
    },
  });

  console.log('✅ Created post 2:', post2.id);

  // Add some likes to make it look active
  console.log('🌱 Seeding completed successfully!');
  console.log('📧 Demo account: sarah.innovator@example.com / Demo123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
