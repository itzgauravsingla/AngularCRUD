import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Data } from './data.module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularHTTP';
  loadedData: Data[] = [];
  isFetching: boolean = false;
  editMode = false;
  idid = '';
  desc = '';

  @ViewChild('f') formData !: NgForm;

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.fetchData();
  }


  onFetch(){
    this.fetchData();
  }

  private fetchData(){
    this.isFetching = true;
    this.http.get("https://3gu8fobdu7.execute-api.us-east-2.amazonaws.com/v1/api/msbdocs/getmessage?operation=read&operation=read")
    .subscribe((responseData) => {
      this.isFetching = false;
      // console.log(responseData);
      this.loadedData = responseData["Items"];
      console.log(this.loadedData);
    })
  }

  onDelete(index: number){
    const id = this.loadedData[index].id;
    const urlRequest = `https://3gu8fobdu7.execute-api.us-east-2.amazonaws.com/v1/api/msbdocs/getmessage?operation=delete&id=${id}`;
    // console.log(urlRequest);
    this.http.delete(urlRequest).subscribe(()=>{
      this.fetchData();
    })
  }

  onEdit(index: number){
    this.editMode = true;
    this.idid = this.loadedData[index].id;
    this.desc =  this.loadedData[index].description;
  }

  onPost(){
    // console.log(this.formData);
    const description = this.formData.value.description;
    const id = this.formData.value.id;
    const payload = {
      operation: 'create',
      payload: {Item: {
          description : description,
          id : id
        }
      }
    }
    const urlRequest = `https://3gu8fobdu7.execute-api.us-east-2.amazonaws.com/v1/api/msbdocs/getmessage?operation=create`;
    this.http.post(urlRequest, payload)
    .subscribe((response) => {
      this.fetchData();
    });
  }
}
