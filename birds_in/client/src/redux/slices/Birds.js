import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    images:[{
        'name': 'pajaro1',
        'url': 'https://images.unsplash.com/photo-1553736277-055142d018f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=758&q=80',
      },
      {
        'name': 'pajaro2',
        'url': 'https://images.unsplash.com/photo-1553736277-055142d018f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=758&q=80',
      },
      {
        'name': 'pajaro2',
        'url': 'https://images.unsplash.com/photo-1553736277-055142d018f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=758&q=80',
      },
      {
        'name': 'pajaro2',
        'url': 'https://images.unsplash.com/photo-1553736277-055142d018f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=758&q=80',
      },
      {
        'name': 'pajaro2',
        'url': 'https://images.unsplash.com/photo-1553736277-055142d018f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=758&q=80',
      },
      {
        'name': 'pajaro2',
        'url': 'https://images.unsplash.com/photo-1553736277-055142d018f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=758&q=80',
      }
    
      ]
    
};

export const birdSlice = createSlice({
    name: 'bird',
    initialState,

    reducers: {
        imageGallery: (state, action) => {
            state.images = action.payload
        },
    },
});

export const { imageGallery } = birdSlice.actions;
export default birdSlice.reducer;