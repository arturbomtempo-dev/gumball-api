import { Injectable, NotFoundException } from '@nestjs/common';
import { parseSort } from '../../common/pagination/sort.js';
import { animationStyleCodec, genderCodec, roleCodec, statusCodec } from './character.enums.js';
import { CharacterMapper } from './character.mapper.js';
import { CharactersRepository } from './characters.repository.js';
import type { CharacterResponseDto } from './dto/character-response.dto.js';
import type {
    CharacterSortField,
    ListCharactersQueryDto,
} from './dto/list-characters-query.dto.js';

export interface CharacterPage {
    items: CharacterResponseDto[];
    total: number;
}

@Injectable()
export class CharactersService {
    constructor(private readonly repository: CharactersRepository) {}

    async list(query: ListCharactersQueryDto): Promise<CharacterPage> {
        const sort = parseSort<CharacterSortField>(query.sort);

        const { items, total } = await this.repository.findMany({
            filters: {
                search: query.search,
                species: query.species,
                gender: query.gender && genderCodec.toDatabase(query.gender),
                role: query.role && roleCodec.toDatabase(query.role),
                status: query.status && statusCodec.toDatabase(query.status),
                animationStyle:
                    query.animationStyle && animationStyleCodec.toDatabase(query.animationStyle),
                voiceActor: query.voiceActor,
                firstAppearanceId: query.firstAppearanceId,
                ids: query.ids,
            },
            sortField: sort.field,
            sortDirection: sort.direction,
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        return { items: items.map(CharacterMapper.toResponse), total };
    }

    async findById(id: number): Promise<CharacterResponseDto> {
        const character = await this.repository.findById(id);

        if (!character) {
            throw new NotFoundException(`Character with id ${id} not found`);
        }

        return CharacterMapper.toResponse(character);
    }

    async findBySlug(slug: string): Promise<CharacterResponseDto> {
        const character = await this.repository.findBySlug(slug);

        if (!character) {
            throw new NotFoundException(`Character with slug "${slug}" not found`);
        }

        return CharacterMapper.toResponse(character);
    }

    async findRandom(count: number): Promise<CharacterResponseDto[]> {
        const characters = await this.repository.findRandom(count);

        return characters.map(CharacterMapper.toResponse);
    }
}
