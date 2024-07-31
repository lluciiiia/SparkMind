interface Json {
  metadata: {
    [key: string]: string | number | boolean | null
  }
  data: {
    [key: string]: string | number | boolean | null
  }
}
