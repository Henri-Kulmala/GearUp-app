
import { useState } from 'react';
import GearForm from './Components/AddGearFrom';
import GearList from './Components/ListGearData';
import GearSearch from './Components/SearchGearData';

const App = () => {
    const [gearItems, setGearItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const addGearItem = (item) => {
        setGearItems([...gearItems, item]);
    };

    const filteredGearItems = gearItems.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>GearUp - Hiking gear inventory</h1>
            <GearForm addGearItem={addGearItem} />
            <GearSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <GearList gearItems={filteredGearItems} />
        </div>
    );
};

export default App;
