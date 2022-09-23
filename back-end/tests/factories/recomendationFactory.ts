import { faker } from '@faker-js/faker';
import { prisma } from "../../src/database";

export async function createRecommendationData() {
    const recommendation = await prisma.recommendation.create({
        data: {
          name: faker.lorem.words(4),
          youtubeLink: 'https://www.youtube.com/watch?v=65Th0jPbsrE'
        }
      });
    
      return recommendation;
}