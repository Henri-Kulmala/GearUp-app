
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const GearForm = ({ addGearItem }) => {
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [weight, setWeight] = useState('');
    const [importance, setImportance] = useState('Essential');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newGearItem = {
            itemName,
            category,
            weight: weight ? parseFloat(weight) : null, 
            importance,
        };
        addGearItem(newGearItem);

        setItemName('');
        setCategory('');
        setWeight('');
        setImportance('Essential');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Item Name:</label>
                <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Category:</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Weight (g):</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
            </div>
            <div>
                <label>Importance:</label>
                <select
                    value={importance}
                    onChange={(e) => setImportance(e.target.value)}
                >
                    <option value="Essential">Essential</option>
                    <option value="Optional">Optional</option>
                </select>
            </div>
            <button type="submit">Add Gear</button>
        </form>
    );
};

export default GearForm;
