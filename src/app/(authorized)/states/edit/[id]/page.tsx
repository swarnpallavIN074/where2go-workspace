import AddEditState from "@/components/AddEditState";

const EditState = ({ params: { id } }: { params: { id: string } }) => {
	return <AddEditState id={id} />;
};

export default EditState;
