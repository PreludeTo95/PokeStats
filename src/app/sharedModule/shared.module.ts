import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoveHyphenPipe } from './pipes/remove-hyphen.pipe';

@NgModule({
  declarations: [
    RemoveHyphenPipe
],
  exports: [
    RemoveHyphenPipe
],  
  imports: [
    CommonModule
]
})

export class SharedModule {

}
