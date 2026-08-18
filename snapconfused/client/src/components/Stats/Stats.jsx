import "./Stats.css";

const stats = [
    {
        icon: "😂",
        value: "50K+",
        label: "People relate",
    },
    {
        icon: "👻",
        value: "200K+",
        label: "Confusions shared",
    },
    {
        icon: "😍",
        value: "98%",
        label: "Still don't get it",
    },
    {
        icon: "😎",
        value: "100%",
        label: "Still using it anyway",
    },
];

const Stats = () => {
    return (
        <section className="stats-section">
            <div className="stats-container">
                {stats.map((stat, index) => (
                    <div className="stat-item" key={stat.value}>

                        <div className="stat-icon">
                            {stat.icon}
                        </div>

                        <div className="stat-content">
                            <strong>{stat.value}</strong>
                            <span>{stat.label}</span>
                        </div>

                        {index !== stats.length - 1 && (
                            <div className="stat-divider" />
                        )}

                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;