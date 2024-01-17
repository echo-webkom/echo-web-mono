import { Box, Button, Flex, TextInput } from "@sanity/ui";
import { nanoid } from "nanoid";
import { set, type StringInputProps, type StringSchemaType } from "sanity";

export function IdInput(props: StringInputProps<StringSchemaType>) {
  const { value, onChange, elementProps } = props;

  const handleGenerateId = () => {
    onChange(set(nanoid()));
  };

  return (
    <Flex gap={1}>
      <Box
        style={{
          flex: 1,
        }}
      >
        <TextInput
          {...elementProps}
          value={value}
          onChange={(e) => onChange(set(e.currentTarget.value))}
        />
      </Box>
      <Box>
        <Button
          style={{
            height: 35,
          }}
          onClick={handleGenerateId}
          mode="ghost"
        >
          Re-generate
        </Button>
      </Box>
    </Flex>
  );
}
