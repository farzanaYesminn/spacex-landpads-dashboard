import axios from 'axios';

const API_BASE = 'https://api.spacexdata.com/v3/landpads';

export const getLandingPads = async () => {
    const response = await axios.get(API_BASE);
    return response.data;
};
