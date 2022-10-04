import express, { request, response } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client';
import { convert } from './utils/convert';
import { convertMinutesToHours } from './utils/convertMinutesToHours';

const app = express()

app.use(express.json())
app.use(cors())

// Conexao com o BD Prisma
const prisma = new PrismaClient({
    log: ['query']
})

// HTTP methods * API Restful

// localhost : 3333/ads

app.get('/games', async (request, response) => {

    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json(games);
});


// Cria um anuncio passando o id do game
app.post('/games/:id/ads', async(request, response) => {

    const gameId = request.params.id;
    const body: any = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hoursStart: convert(body.hoursStart),
            hoursEnd: convert(body.hoursEnd),
            useVoidChannel: body.useVoidChannel,
        },
    });

    return response.status(201).json(ad);
});



app.get('/games/:id/ads', async (request, response) => {

     const gameId = request.params.id;

     const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoidChannel: true,
            yearsPlaying: true,
            hoursStart: true,
            hoursEnd: true,
        },

        where: {
            gameId,
        },

        orderBy: {
            createdAt: 'desc'
        },
     });

    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHours(ad.hoursStart),
            hoursEnd: convertMinutesToHours(ad.hoursEnd)
        }
    }));
});


// Reecebe o id do anuncio e lista o discord
app.get('/ads/:id/discord', async (request, response) => {

    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id: adId,
        }
    });

    return response.json({
        discord: ad.discord,
    });
});

app.listen(3333)