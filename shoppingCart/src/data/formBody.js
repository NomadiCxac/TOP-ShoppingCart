const updateRequestBody = {
    requests: [
      {
        createItem: {
          item: {
            title: "Name",
            questionItem: {
              question: {
                required: true,
                textQuestion: {}
              }
            }
          },
          location: {
            index: 0
          }
        }
      },
      {
        createItem: {
          item: {
            title: "Email",
            questionItem: {
              question: {
                required: true,
                textQuestion: {}
              }
            }
          },
          location: {
            index: 1
          }
        }
      },
      {
        createItem: {
          item: {
            title: "Select a Date",
            questionItem: {
              question: {
                required: true,
                dateQuestion: {}
              }
            }
          },
          location: {
            index: 2
          }
        }
      },
      {
        createItem: {
          item: {
            title: "Additional Comments",
            questionItem: {
              question: {
                required: false,
                paragraphTextQuestion: {
                  maxLength: 200
                }
              }
            }
          },
          location: {
            index: 3
          }
        }
      }
    ]
  };

  export default updateRequestBody;