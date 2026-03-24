package model

type Reference struct {
	Key  string `json:"_key"`
	Ref  string `json:"_ref"`
	Type string `json:"reference"`
}

type Asset struct {
	Type string `json:"_type"`
	Ref  string `json:"_ref"`
}

type Image struct {
	Type  string `json:"_type"`
	Asset Asset  `json:"asset"`
}

type HSL struct {
	Type string  `json:"_type"`
	A    float32 `json:"a"`
	H    float32 `json:"h"`
	L    float32 `json:"l"`
	S    float32 `json:"s"`
}

type HSV struct {
	Type string  `json:"_type"`
	A    float32 `json:"a"`
	H    float32 `json:"h"`
	S    float32 `json:"s"`
	V    float32 `json:"v"`
}

type RGB struct {
	Type string  `json:"_type"`
	A    float32 `json:"a"`
	R    float32 `json:"r"`
	G    float32 `json:"g"`
	B    float32 `json:"b"`
}

type Color struct {
	Type  string  `json:"_type"`
	Alpha float32 `json:"alpha"`
	HSL   HSL     `json:"hsl"`
	HSV   HSV     `json:"hsv"`
	RGB   RGB     `json:"rgb"`
}
