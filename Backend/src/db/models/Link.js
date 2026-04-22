const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

const Link = sequelize.define(
  "Link",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    originalUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "original_url",
    },
    clicks: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "links",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["slug"] },
      { fields: [{ name: "created_at", order: "DESC" }] },
    ],
  }
);

module.exports = Link;
