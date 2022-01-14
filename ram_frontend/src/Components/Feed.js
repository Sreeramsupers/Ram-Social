import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
	const [pins, setPins] = useState();
	const [loading, setLoading] = useState(false);
	const { categoryId } = useParams();

	useEffect(() => {
		if (categoryId) {
			setLoading(true);
			const query = searchQuery(categoryId);
			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		} else {
			setLoading(true);

			if (feedQuery !== null) {
				client.fetch(feedQuery).then((data) => {
					setPins(data);
					setLoading(false);
				});
			}
		}
	}, [categoryId]);
	const ideaName = categoryId || 'new';
	if (loading) {
		return <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />;
	}
	return (
		<div>
			{pins?.length !== 0 ? (
				<MasonryLayout pins={pins} />
			) : (
				<h3 className='flex text-lg text-gray-700 sm:text-2xl items-center justify-center'>
					No Pins Found here!
				</h3>
			)}
		</div>
	);
};

export default Feed;
