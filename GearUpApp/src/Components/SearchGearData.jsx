/* eslint-disable react/prop-types */

const GearSearch = ({ searchTerm, setSearchTerm }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Search by item name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default GearSearch;
