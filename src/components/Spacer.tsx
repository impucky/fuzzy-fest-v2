export default function Spacer({ label = "" }: { label?: string }) {
  if (label === "") {
    return (
      <div className="m-4 w-full px-4 opacity-80">
        <div className="border-t border-[salmon]"></div>
      </div>
    );
  }

  return (
    <div className="mt-5 flex w-full items-center px-4 opacity-80">
      <div className="flex-1 border-t border-[salmon]"></div>
      <span className="mx-4 text-xl font-bold text-[salmon]">{label}</span>
      <div className="flex-1 border-t border-[salmon]"></div>
    </div>
  );
}
