import { Injectable } from '@angular/core';
import {catchError, from, map, mergeMap, Observable, of} from "rxjs";
import { User } from '../models/User';
import { Sub } from '../models/Sub';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Post} from "../models/Post";
import {Comment} from "../models/Comment";
import {
  collection,
  collectionData, deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where
} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: AngularFirestore) { }

  async uploadUserData(userdata: User): Promise<void> {
    await this.firestore.collection("users").add({username: userdata.username, email: userdata.email});
  }

  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges();
  }

  getUserFromEmail(email: string | null): Promise<User> {
    return new Promise(async (resolve, reject) => {
      if (email === null || email === undefined) reject('Got null value');

      const usersRef = collection(this.firestore.firestore, "users");
      const userQuery = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.docs.length > 0) {
        const user = querySnapshot.docs[0].data() as User;
        resolve(user);
      }
      else reject();
    });
  }

  async checkUserData(username: string, email: string): Promise<{ username: boolean, email: boolean }> {
    return new Promise(async (resolve, reject) => {
      let usernameExists = false;
      let emailExists = false;

      this.getUsers().subscribe(users => {
        users.forEach(user => {
          if (user.username == username) {
            usernameExists = true;
          }
          if (user.email == email) {
            emailExists = true;
          }
        });
        resolve({username: usernameExists, email: emailExists});
      }, reject);
    });
  }

  getSubs(): Observable<Sub[]> {
    return this.firestore.collection<Sub>('subs').valueChanges();
  }

  async checkSubExists(name: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const subsRef = collection(this.firestore.firestore, "subs");
      const subsQuery = query(subsRef, where('name', '==', name));
      const querySnapshot = await getDocs(subsQuery);

      if (querySnapshot.docs.length > 0) {
        resolve(true);
      }
      else reject();
    });
  }

  async uploadSub(sub: Sub): Promise<void> {
    await this.firestore.collection("subs").doc(sub.name).set(sub);
  }

  async uploadPost(post: Post, sub: string): Promise<void> {
    await this.firestore.collection("subs").doc(sub).collection("posts").doc(post.id).set(post);
  }

  getPosts(sub: string): Observable<Post[]> {
    return this.firestore.collection("subs").doc(sub).collection<Post>("posts").valueChanges();
  }

  async checkPostExists(subName: string | null, postId: string | null): Promise<Post | null> {
    return new Promise(async (resolve, reject) => {
      if (subName != null && postId != null) {
        this.firestore.collection("subs").doc(subName).collection<Post>("posts").doc(postId)
          .valueChanges().subscribe(post => {
          if (post != undefined) resolve(post);
          else resolve(null);
        })
      }
      reject;
    });
  }

  async uploadComment(subName: string, postId: string, comment: Comment): Promise<void> {
    await this.firestore.collection("subs").doc(subName).collection("posts").doc(postId)
      .collection("comments").doc().set(comment);
  }

  getComments(sub: string, postId: string): Observable<Comment[]> {
    return this.firestore.collection("subs").doc(sub).collection("posts").doc(postId).collection<Comment>("comments").valueChanges();
  }

  getTopPostsFromAllSubs(): Observable<Post[]> {
    return this.getSubs().pipe(
      mergeMap(subs => from(subs).pipe(
        mergeMap(sub => this.getTopPostsFromSub(sub.name))
      )),
      map(postList => postList.flat()),
      catchError(error => of([]))
    );
  }

  private getTopPostsFromSub(subName: string): Observable<Post[]> {
    const subPostsRef = collection(this.firestore.firestore, 'subs', subName, 'posts');
    const topPostsQuery = query(subPostsRef, limit(10));
    return collectionData(topPostsQuery, { idField: 'id' }) as Observable<Post[]>;
  }

  changeUsername(oldName: string, newName: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const existingUserRef = doc(this.firestore.firestore, "users", newName);const existingUserDoc = await getDoc(existingUserRef);
      if (existingUserDoc.exists()) {
        reject("Username already exists");
      }

      const userRef = collection(this.firestore.firestore, "users");
      const userQuery = query(userRef, where('username', '==', oldName));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.docs.length === 0) {
        reject("User not found");
      }

      const userDoc = querySnapshot.docs[0]; // Assuming only one user with old name
      await updateDoc(userDoc.ref, { username: newName });

      resolve(true);
    });
  }

  deleteUser(username: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const userRef = collection(this.firestore.firestore, 'users');
      const userQuery = query(userRef, where('username', '==', username));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.docs.length === 0) {
        reject();
      }

      const userDoc = querySnapshot.docs[0];
      const documentId = userDoc.id;

      deleteDoc(doc(this.firestore.firestore, 'users', documentId)).then(() => {
        resolve(true);
      }).catch(error => {reject(error); });
    });
  }
}
