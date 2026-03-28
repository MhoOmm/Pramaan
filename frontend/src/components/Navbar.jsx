import Button from "./Button";
import logo from "../assets/logo.jpeg"

const Navbar = () => {


  return (
    <nav
      className={`absolute top-0 w-full z-50 transition-all duration-500`}
    >
      <div className="w-full max-w-7xl mx-auto px-8 lg:px-12">
        <div className="relative flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="/"
            className="flex-shrink-0 text-white font-black text-lg tracking-[0.3em] uppercase select-none"
          >
            <img src={logo} alt="PRAMAAN" className="h-16 md:h-24 w-auto object-contain transition-all duration-300 hover:scale-105 brightness-110 contrast-110" />
          </a>



          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="#detection"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('detection')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Button className="group">
                <span>Verify Content</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </a>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;