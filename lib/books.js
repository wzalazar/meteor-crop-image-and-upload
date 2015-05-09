Books = new Mongo.Collection("books");
Books.attachSchema(new SimpleSchema({
  photo: {
        label: 'photo',
        type: String,
        optional: true,
        autoform: {
            type: "crop-image",
            width : 500,
            height : 300
        }
  },
  author: {
    type: String,
    label: "Author"
  },
  copies: {
    type: Number,
    label: "Number of copies",
    min: 0
  },
  lastCheckedOut: {
    type: Date,
    label: "Last date this book was checked out",
    optional: true
  },
  summary: {
    type: String,
    label: "Brief summary",
    optional: true,
    max: 1000
  }
}));