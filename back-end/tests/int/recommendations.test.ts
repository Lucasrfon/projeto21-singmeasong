import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import { createRecommendationData, createSeveralRecommendationsData, recommendationFactory } from "../factories/recommendationFactory";
import { deleteAllData } from "../factories/scenarioFactory";

beforeEach(async () => {
    await deleteAllData();
});

describe('POST /recommendations', () => {
    
    it('Em caso de sucesso deve retornar status 201 e cadastrar recomendação', async () => {
        const newRecommendation = await recommendationFactory();
        const result = await supertest(app).post("/recommendations").send(newRecommendation);
        const status = result.status;
        const recommendation = await prisma.recommendation.findFirst({where: { name: newRecommendation.name }});

        expect(status).toBe(201);
        expect(recommendation).not.toBeFalsy();
    });

    it('Em caso de nome já cadastrado deve retornar status 409 e não cadastrar recomendação', async () => {
        const {name, youtubeLink} = await createRecommendationData();
        const result = await supertest(app).post("/recommendations").send({name, youtubeLink});
        const status = result.status;
        const recommendation = await prisma.recommendation.findMany({where: { name }});

        expect(status).toBe(409);
        expect(recommendation).toHaveLength(1);
    });
});

describe('GET /recommendations', () => {
    
    it('Em caso de sucesso deve retornar as 10 últimas recomendações', async () => {
        const recommendations = await createSeveralRecommendationsData();
        const result = await supertest(app).get("/recommendations").send();

        expect(result.body).toHaveLength(10);
        expect(recommendations[recommendations.length - 1]).toEqual(result.body[0]);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});