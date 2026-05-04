/*
 * Copyright 2026 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PluginTranslatePipeModule} from "@valtimo/plugin";
import {
  CarbonMultiInputModule,
  FormModule, InputLabelModule,
  InputModule,
  ModalModule,
  MultiInputFormModule,
  ParagraphModule, RadioModule,
  SelectModule, TooltipIconModule, ValtimoCdsModalDirective, VModalModule
} from "@valtimo/components";
import {DocumentVerzoekConfigurationComponent} from "./components/document-verzoek-configuration/document-verzoek-configuration.component";

import {
  IconModule,
  InputModule as CarbonInputModule,
  ButtonModule as CarbonButtonModule
} from "carbon-components-angular";

@NgModule({
  declarations: [DocumentVerzoekConfigurationComponent],
  imports: [
    CommonModule,
    PluginTranslatePipeModule,
    FormModule,
    InputModule,
    SelectModule,
    ParagraphModule,
    MultiInputFormModule,
    RadioModule,
    InputLabelModule,
    ModalModule,
    CarbonInputModule,
    TooltipIconModule,
    CarbonMultiInputModule,
    CarbonButtonModule,
    ValtimoCdsModalDirective,
    VModalModule,
    IconModule,
  ],
  exports: [DocumentVerzoekConfigurationComponent],
})
export class DocumentVerzoekPluginModule {}
