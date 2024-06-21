import { TailSpin } from "react-loader-spinner";
const ButtonLoader = () => {
  return (
    <TailSpin
      height="30"
      width="30"
      color="#000814"
      ariaLabel="tail-spin-loading"
      radius="4"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};
export default ButtonLoader;
