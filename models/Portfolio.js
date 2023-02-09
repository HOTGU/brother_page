import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
    photos: [String],
    title: String,
});

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

export default Portfolio;
