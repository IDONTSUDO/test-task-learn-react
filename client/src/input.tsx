export const Input: React.FC<{
  onChange: (text: string) => void;
  name: string;
}> = ({  onChange, name }) => {
  return (
    <>
      <div>{name}</div>
      <input
        type="text"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </>
  );
};
