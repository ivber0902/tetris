package main

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	"time"
)

var DB *mongo.Database

func ConnectToDatabase() error {
	loadEnv()
	dbURI := os.Getenv("DATABASE_URI")
	if dbURI == "" {
		return errors.New("DATABASE_URI environment variable not set")
	}
	opt := options.Client().ApplyURI(dbURI)
	client, err := mongo.Connect(context.TODO(), opt)
	if err != nil {
		return err
	}

	DB = client.Database(os.Getenv("DATABASE_NAME"))

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var result bson.M
	if err := DB.RunCommand(ctx, bson.D{{"ping", 1}}).Decode(&result); err != nil {
		return err
	}
	return nil
}
