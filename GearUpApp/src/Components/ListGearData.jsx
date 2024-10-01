/* eslint-disable react/prop-types */


const GearList = ({ gearItems }) => {
    return (
        <div>
            <h2>Gear Items</h2>
            <ul>
                {gearItems.map((item, index) => (
                    <li key={index}>
                        {item.itemName} - {item.category} - {item.weight ? `${item.weight} g` : 'No weight'} - {item.importance}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GearList;
