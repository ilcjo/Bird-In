import * as React from 'react'

import { SearchBird } from '../SearchBird';
import { UpdateBirds } from '../Forms/UpdateBirds';

export const Update = () => {
    const [showForm, setShowForm] = React.useState(false);

    const toggleForm = () => {
        setShowForm(true);
    };

    return (
        <div>
            <SearchBird showForm={showForm} toggleForm={toggleForm} />
            {showForm && (
                <div>
                    <UpdateBirds />
                </div>
            )}

        </div>
    );
};