'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LucideCamera, LucideUpload } from 'lucide-react';

import { addPictureToUsersCat } from '@/db/queries/usersCatNamesQueries';

export const CatPictureUpload = ({
	userCatNameId
}: {
	userCatNameId: number;
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [preview, setPreview] = useState<string | null>(null);

	const handleFileChange = (data: React.ChangeEvent<HTMLInputElement>) => {
		if (data.target.files) {
			const file = data.target.files[0];
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleButtonClick = (capture?: string) => {
		if (inputFileRef.current) {
			inputFileRef.current.capture = capture ?? '';
			inputFileRef.current.click();
		}
	};

	return (
		<div className="mx-auto max-w-md rounded-md bg-white p-4">
			<h1 className="mb-4 text-xl font-bold">Nahrát novou fotku</h1>
			{preview && (
				<div className="m-4 flex-col rounded">
					<p className="text-center">Náhled:</p>
					<Image
						src={preview}
						alt="Preview"
						className="mx-auto h-48 w-48 rounded object-cover"
						width={100}
						height={100}
					/>
				</div>
			)}
			<form
				onSubmit={async event => {
					event.preventDefault();
					setIsLoading(true);

					if (!inputFileRef.current?.files) {
						throw new Error('No file selected');
					}

					const file = inputFileRef.current.files[0];

					const response = await fetch(
						`/api/usersCatNames/upload?filename=${file.name}`,
						{
							method: 'POST',
							body: file
						}
					);

					const newBlob = await response.json();

					addPictureToUsersCat(userCatNameId, newBlob.url);
					setIsLoading(false);
					router.replace('/my-names');
				}}
			>
				<div>
					<input
						ref={inputFileRef}
						type="file"
						accept="image/*"
						required
						className="hidden"
						onChange={handleFileChange}
					/>
					<div className="flex items-center justify-center gap-4">
						<button
							type="button"
							onClick={() => handleButtonClick()}
							className="flex h-28 items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none"
						>
							<div className="flex flex-col items-center justify-center">
								<p className="p-2 text-center">Nahrát ze zařízení</p>
								<LucideUpload size={24} />
							</div>
						</button>
						<button
							type="button"
							onClick={() => handleButtonClick('environment')}
							className="flex h-28 w-32 items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none lg:hidden"
						>
							<div className="flex flex-col items-center justify-center">
								<p className="text-center">Vyfotit</p>
								<LucideCamera size={24} />
							</div>
						</button>
					</div>
				</div>

				<button
					type="submit"
					className="mt-4 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				>
					{isLoading ? 'Ukládání...' : 'Uložit'}
				</button>
			</form>
		</div>
	);
};
