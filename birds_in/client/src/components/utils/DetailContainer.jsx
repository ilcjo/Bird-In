import * as React from 'react'
import { useSelector } from 'react-redux';
import { PhotosDetailAves } from '../Mains/Aves/PhotosDetailAves';

export const DetailContainer = () => {
    const { infoBirds } = useSelector(state => state.birdSlice);

    // Render PhotosDetailAves only if there's exactly one bird detail
    if (infoBirds.length === 1) {
        return <PhotosDetailAves bird={infoBirds[0]} />;
    }

    return null;
};
