import "../../styles/categories.css";

const categories = [
  {
    title: "SSC",
    icon: "📚",
    desc: "SSC CGL, CHSL, MTS & GD"
  },
  {
    title: "Railway",
    icon: "🚆",
    desc: "RRB NTPC, Group D, ALP"
  },
  {
    title: "Banking",
    icon: "🏦",
    desc: "IBPS, SBI PO, Clerk"
  },
  {
    title: "UPSC",
    icon: "🎯",
    desc: "Civil Services Preparation"
  },
  {
    title: "BPSC",
    icon: "🏛️",
    desc: "Bihar Public Service"
  },
  {
    title: "Police",
    icon: "👮",
    desc: "SI, Constable & More"
  }
];

function Categories() {
  return (
    <section className="categories">

      <h2>Popular Exam Categories</h2>

      <div className="categoryGrid">

        {categories.map((item, index) => (
          <div className="categoryCard" key={index}>
            <div className="icon">{item.icon}</div>

            <h3>{item.title}</h3>

            <p>{item.desc}</p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Categories;