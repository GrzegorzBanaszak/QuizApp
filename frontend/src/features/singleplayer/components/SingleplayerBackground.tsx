export const SingleplayerBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-[#e08dff]/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[#ff68a7]/10 blur-[120px]" />
      <div className="absolute left-[-8rem] top-1/3 h-72 w-72 rounded-full bg-[#8ff5ff]/6 blur-[120px]" />
    </div>
  );
};
