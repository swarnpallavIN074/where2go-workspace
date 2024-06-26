import AddEditCity from "@/components/AddEditCity";

const EditCity = ({ params: { id } }: { params: { id: string } }) => {
	return <AddEditCity id={id} />;
};

export default EditCity;
