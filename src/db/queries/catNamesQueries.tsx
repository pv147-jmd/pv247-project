import { eq, like, notInArray, sql } from 'drizzle-orm';
import { useMutation, useQuery } from '@tanstack/react-query';

import { db } from '@/db';
import { assignCatWithPictureNameToUser } from '@/db/usersCatNames/actions';

import { catNames, type CatNames } from '../schema/catNames';
import { usersCatNames } from '../schema/usersCatNames';

export const getAllCatNames = async (): Promise<CatNames[]> =>
	await db.query.catNames.findMany();

export const useAllCatNames = () =>
	useQuery<CatNames[]>({
		queryKey: ['allCatNames'],
		queryFn: getAllCatNames
	});

export const getRandomCatNames = async (
	userId: string = '-1',
	count: number = 10
): Promise<CatNames[]> => {
	if (userId !== '-1') {
		const userNames = await db
			.select({ nameId: usersCatNames.catNameId })
			.from(usersCatNames)
			.where(eq(usersCatNames.userId, userId));

		const userNameIds = userNames.map(entry => entry.nameId);

		return await db.query.catNames.findMany({
			limit: count,
			orderBy: sql`RANDOM()`,
			where: notInArray(catNames.id, userNameIds)
		});
	}

	return await db.query.catNames.findMany({
		limit: 10,
		orderBy: sql`RANDOM()`
	});
};

export const useRandomCatNames = (userId: string = '-1', count: number = 10) =>
	useQuery<CatNames[]>({
		queryKey: ['tenRandomCatNames'],
		queryFn: () => getRandomCatNames(userId, count),
		refetchOnWindowFocus: false
	});

export const searchCatNames = async (
	searchTerm: string
): Promise<CatNames[]> => {
	if (!searchTerm) return getAllCatNames();
	return await db.query.catNames.findMany({
		where: fields => like(fields.name, `${searchTerm}%`)
	});
};
await db.query.catNames.findMany();

export const useSearchCatNames = (searchTerm: string) =>
	useQuery<CatNames[]>({
		queryKey: ['searchCatNames'],
		queryFn: () => searchCatNames(searchTerm)
	});

export const addCatName = async (name: string, userId: string) => {
	const [insertedId] = await db
		.insert(catNames)
		.values({
			name,
			userId
		})
		.returning({ id: catNames.id });

	if (!insertedId) {
		throw new Error('Nepodařilo se vložit nové jméno.');
	}

	return insertedId.id;
};

export const getCatNameById = async (id: number) =>
	await db.query.catNames.findFirst({
		where: eq(catNames.id, id)
	});

export const useAssignCatMutation = () =>
	// const queryClient = useQueryClient();
	useMutation({
		mutationKey: ['assignCat'],
		mutationFn: ({
			userId,
			catNameId,
			pictureUrl
		}: {
			userId: string;
			catNameId: number;
			pictureUrl: string;
		}) => assignCatWithPictureNameToUser(userId, catNameId, pictureUrl),
		onSuccess: () => {}
	});
