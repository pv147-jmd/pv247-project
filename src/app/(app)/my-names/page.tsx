import Image from 'next/image';

import { db } from '@/db';
import { EditMyCat } from '@/app/(app)/my-names/[slug]/EditMyCat';
import { getUsersCatNames } from '@/db/queries/usersCatNamesQueries';

const MyCatNames = async () => {
	const ownedCats = await getUsersCatNames(1);
	return (
		<>
			<h1 className="text-3xl">Moje kočičky</h1>

			<div className="mt-10">
				<table className="min-w-full border-collapse border border-gray-300 bg-white shadow-sm">
					<thead>
						<tr className="bg-gray-100">
							<th className="border border-gray-300 px-4 py-2 text-left">#</th>
							<th className="border border-gray-300 px-4 py-2 text-left">
								Jméno
							</th>
						</tr>
					</thead>
					<tbody>
						{ownedCats.length > 0 ? (
							ownedCats.map((catName, index) => (
								<tr key={catName.catNameId} className="hover:bg-gray-50">
									<td className="border border-gray-300 px-4 py-2">
										{index + 1}
									</td>
									<td className="border border-gray-300 px-4 py-2">
										jméno kočky
									</td>
									<td className="border border-gray-300 px-4 py-2">
										{catName.pictureUrl ? (
											<Image
												src={catName.pictureUrl}
												alt="Cat"
												className="h-16 w-16 object-cover"
												width={64}
												height={64}
											/>
										) : (
											'No picture'
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={3}
									className="border border-gray-300 px-4 py-2 text-center text-gray-500"
								>
									Nemáte přiřazená žádná jména koček.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<EditMyCat catNameId={1} />
		</>
	);
};

export default MyCatNames;
