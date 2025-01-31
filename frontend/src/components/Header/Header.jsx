import Input from "../Input";
import Button from "../Button";
export default function Header() {
  return (
    <div className="h-20  flex justify-start items-center">
      <h1 className=" font-extrabold text-4xl">Nivaran</h1>

      <div className=" ml-3 sm:ml-auto flex items-center"> 
        <Input
          type="text"
          placeholder="Search"
          className="w-72"
        />
        <Button className="ml-2 sm:ml-5 bg-blue-500 text-white px-2 sm:px-4 py-2 rounded-lg">
          Search
        </Button>

      </div>
    </div>
  );
}
