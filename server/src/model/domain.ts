import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema({
  Value: {
    type: String,
    required: true,
  },
});

const dnsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  TTL: {
    type: Number,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    required: true,
    trim: true,
  },

  Records: {
    type: [RecordSchema],
    required: true,
  },
});

export const DnsRecord = mongoose.model("dnsrecord", dnsSchema);
