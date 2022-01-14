import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

const PinDetail = ({ user }) => {
	const [pins, setPins] = useState(null);
	const [pinDetail, setPinDetail] = useState(null);
	const [comment, setComment] = useState('');
	const [addingComment, setAddingComment] = useState(false);

	const { pinId } = useParams();

	const fetchPinDetails = () => {
		var query = pinDetailQuery(pinId);

		if (query) {
			client.fetch(query).then((data) => {
				setPinDetail(data[0]);
				if (data[0]) {
					query = pinDetailMorePinQuery(data[0]);

					client.fetch(query).then((res) => setPins(res));
				}
			});
		}
	};

	useEffect(() => {
		fetchPinDetails();
	}, [pinId]);

	const addComment = () => {
		if (comment) {
			setAddingComment(true);

			client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert('after', 'comments[-1]', [
					{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } },
				])
				.commit()
				.then(() => {
					fetchPinDetails();
					setComment('');
					setAddingComment(false);
				});
		}
	};

	if (!pinDetail) return <Spinner message='Loading Pin...' />;

	// console.log(pinDetail.comments);

	return (
		<>
			{pinDetail && (
				<>
					<div
						className='flex xl:flex-row xl:gap-3 mt-5 flex-col m-auto bg-white'
						style={{ maxWidth: '1500px', borderRadius: '32px' }}>
						<div className='flex justify-center items-center md:items-start flex-initial'>
							<img
								className='rounded-t-3xl rounded-b-lg'
								src={pinDetail?.image && urlFor(pinDetail?.image).url()}
								alt='user-post'
							/>
						</div>

						<div className='w-full p-5 flex-1 xl:min-w-620'>
							<div>
								<h1 className='text-4xl font-bold break-words mt-3'>{pinDetail.title}</h1>
								<p className='mt-3'>{pinDetail.about}</p>
							</div>

							<div className='flex items-center items center justify-between bg-white rounded-full p-5'>
								<div className='flex gap-2 items-center'>
									<a
										href={`${pinDetail.image?.asset?.url}?dl=`}
										download
										onClick={(e) => e.stopPropagation()}>
										<button className='bg-white py-2 px-4  flex items-center justify-center gap-2 text-dark text-xl opacity-75 hover:opacity-100 outline-none'>
											<MdDownloadForOffline /> Download
										</button>
									</a>
								</div>
								{pinDetail.destination && (
									<a href={pinDetail?.destination} target='_blank' rel='noreferrer'>
										<button className='bg-white py-2 px-4 flex items-center justify-center gap-3 text-dark text-xl opacity-75 hover:opacity-100 outline-none'>
											<BsFillArrowUpRightCircleFill />
											{pinDetail?.destination.length > 20
												? pinDetail?.destination.slice(8, 19)
												: pinDetail?.destination.slice(8)}
											...
										</button>
									</a>
								)}
							</div>

							<Link
								to={`/user-profile/${pinDetail?.postedBy._id}`}
								className='flex gap-3 my-5 items-center bg-white rounded-lg '>
								<img
									src={pinDetail?.postedBy.image}
									className='w-10 h-10 rounded-full'
									alt='user-profile'
								/>
								<p className='font-bold'>{pinDetail?.postedBy.userName}</p>
							</Link>
						</div>
					</div>
					<h2 className='mt-5 text-2xl'>Comments</h2>
					<div className='max-h-370 overflow-y-auto'>
						{pinDetail?.comments?.map((item) => (
							<>
								<div
									className='flex gap-2 my-5 items-center bg-white rounded-lg'
									key={item.comment}>
									<img
										src={item.postedBy?.image}
										className='w-10 h-10 rounded-full cursor-pointer'
										alt='user-profile'
									/>
									<div className='flex flex-col'>
										<p className='font-bold'>{item.postedBy?.userName}</p>
										<p>{item.comment?._key}</p>
									</div>
								</div>
								{/* <hr key={item.comment} className='w-full h-1' /> */}
							</>
						))}
					</div>
					<div className='flex flex-wrap mt-6 mb-10 gap-3'>
						<Link to={`/user-profile/${user?._id}`}>
							<img
								src={user?.image}
								className='w-10 h-10 rounded-full cursor-pointer'
								alt='user-profile'
							/>
						</Link>
						<input
							className=' flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
							type='text'
							placeholder='Add a comment'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<button
							type='button'
							className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
							onClick={addComment}>
							{addingComment ? 'Doing...' : 'Done'}
						</button>
					</div>
				</>
			)}
			{pins?.length > 0 && (
				<h2 className='text-center font-bold text-2xl mt-8 mb-4'>More like this</h2>
			)}
			{pins ? <MasonryLayout pins={pins} /> : <Spinner message='Loading more pins' />}
		</>
	);
};

export default PinDetail;
