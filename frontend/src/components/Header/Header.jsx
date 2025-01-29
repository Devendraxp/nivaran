import Input from "../Input";
import Button from "../Button";
export default function Header() {
  return (
    <div className="h-20  flex justify-start items-center">
      <h1 className=" font-extrabold text-4xl">Nivaran</h1>

      <div className="ml-auto flex items-center"> 
        <Input
          type="text"
          placeholder="Search"
          className="w-72"
        />
        <Button className="ml-5 bg-blue-500 text-white px-4 py-2 rounded-lg">
          Search
        </Button>

      </div>
    </div>
  );
}
