export const HomeNavigation = () => {
  return (
    <>
      <div className="flex items-center justify-end">
        <menu>
          <li className="flex gap-8">
            <button>HOME</button>
            <button>ABOUT</button>
            <button>CONTACT</button>
          </li>
        </menu>
        <button className="bg-navy px-12 py-3 ml-8 text-white rounded-3xl">Sign-up</button>
      </div>
    </>
  );
};
