package database

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
var GameCollection *mongo.Collection

func Connect() error {
	dbURI := os.Getenv("MONGODB_URL")
	if dbURI == "" {
		return errors.New("MONGODB_URL environment variable not set")
	}
	opt := options.Client().ApplyURI(dbURI)
	client, err := mongo.Connect(context.TODO(), opt)
	if err != nil {
		return err
	}

	DB = client.Database(os.Getenv("MONGODB_DB"))

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	var result bson.M
	if err := DB.RunCommand(ctx, bson.D{{"ping", 1}}).Decode(&result); err != nil {
		return err
	}
	GameCollection = DB.Collection("Game")
	return nil
}

func Save(item interface{}) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	_, err := GameCollection.InsertOne(ctx, item)
	return err
}
