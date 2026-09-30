import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import {
    Prisma,
    type AnimationStyle,
    type Character,
    type CharacterGender,
    type CharacterRole,
    type CharacterStatus,
} from '../../generated/prisma/client.js';
import type { CharacterSortField } from './dto/list-characters-query.dto.js';

export interface CharacterFilters {
    search?: string;
    species?: string;
    gender?: CharacterGender;
    role?: CharacterRole;
    status?: CharacterStatus;
    animationStyle?: AnimationStyle;
    voiceActor?: string;
    ids?: number[];
}

export interface CharacterListParams {
    filters: CharacterFilters;
    sortField: CharacterSortField;
    sortDirection: Prisma.SortOrder;
    skip: number;
    take: number;
}

@Injectable()
export class CharactersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(params: CharacterListParams): Promise<{ items: Character[]; total: number }> {
        const where = this.buildWhere(params.filters);

        const [items, total] = await this.prisma.$transaction([
            this.prisma.character.findMany({
                where,
                orderBy: [{ [params.sortField]: params.sortDirection }, { id: 'asc' }],
                skip: params.skip,
                take: params.take,
            }),
            this.prisma.character.count({ where }),
        ]);

        return { items, total };
    }

    findById(id: number): Promise<Character | null> {
        return this.prisma.character.findUnique({ where: { id } });
    }

    findBySlug(slug: string): Promise<Character | null> {
        return this.prisma.character.findUnique({ where: { slug } });
    }

    async findRandom(count: number): Promise<Character[]> {
        const rows = await this.prisma.$queryRaw<{ id: number }[]>(
            Prisma.sql`SELECT id FROM characters ORDER BY random() LIMIT ${count}`
        );
        const ids = rows.map((row) => row.id);
        const characters = await this.prisma.character.findMany({ where: { id: { in: ids } } });
        const byId = new Map(characters.map((character) => [character.id, character]));

        return ids.flatMap((id) => byId.get(id) ?? []);
    }

    private buildWhere(filters: CharacterFilters): Prisma.CharacterWhereInput {
        const where: Prisma.CharacterWhereInput = {
            gender: filters.gender,
            role: filters.role,
            status: filters.status,
            animationStyle: filters.animationStyle,
        };

        if (filters.ids) {
            where.id = { in: filters.ids };
        }

        if (filters.species) {
            where.species = { equals: filters.species, mode: 'insensitive' };
        }

        if (filters.voiceActor) {
            where.voiceActors = { has: filters.voiceActor };
        }

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { fullName: { contains: filters.search, mode: 'insensitive' } },
                { aliases: { has: filters.search } },
            ];
        }

        return where;
    }
}
