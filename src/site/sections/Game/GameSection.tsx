const GameSection = () => {
  return (
    <section id="game" className=" relative flex justify-start items-center px-4  flex-col pb-20 ">
      {/* the lantern img */}
      <img src="/rapunzel-lantern-duo.png" alt="rapunzel lantern img" className="absolute -top-30  -right-2 w-45" />
      {/* the section title */}
      <h2 className="text-ink font-bold font-alex tracking-wider  text-3xl  ">Play With Us</h2>

      {/* the description */}
      <p className="w-full pt-4 font-sans  font-bold text-neutral-700 ">♦ flip the matched cards</p>

      {/* the card img */}
    </section>
  );
};

export default GameSection;
