function Recommendations({ prediction }) {
  if (!prediction) {
    return null;
  }

  const sections = [
    ["🎯 Hobbies", prediction.recommendations.hobbies],
    ["💭 Motivational Quotes", prediction.recommendations.motivational_quotes],
    ["📖 Books", prediction.recommendations.books],
    ["🎬 Anime / Movies", prediction.recommendations.anime_or_movies],
  ];

  return (
    <section>
      <div className="grid-2">
        {sections.map(([title, items]) => (
          <div key={title} className="card">
            <h3 style={{ marginBottom: "1rem" }}>{title}</h3>
            <ul style={{ paddingLeft: "1.5rem", margin: "0" }}>
              {items.map((item) => (
                <li key={item} style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Recommendations;
