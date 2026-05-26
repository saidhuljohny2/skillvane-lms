export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">
          SkillVane IT academy
        </h1>

        <a
          href="#pricing"
          className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-semibold transition"
        >
          Enroll Now
        </a>
      </div>
    </nav>
  );
}
