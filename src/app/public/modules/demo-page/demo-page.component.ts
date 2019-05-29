import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyDocsDemoPageTitleService
} from './demo-page-title.service';
import { SkyPropertyDefinition } from '../property-definitions/property-definition';

// import { SkyPropertyDefinition } from '../property-definitions/property-definition';

const documentationData: any = require('../../../../../documentation/documentation.json');

@Component({
  selector: 'sky-docs-demo-page',
  templateUrl: './demo-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageComponent implements OnInit {

  /**
   * The URL to this module's source code repository.
   */
  @Input()
  public gitRepoUrl: string;

  /**
   * The name of the Angular module the consumer will import into their project.
   */
  @Input()
  public moduleName: string;

  /**
   * The name of the NPM package.
   */
  @Input()
  public packageName: string;

  /**
   * The page title.
   */
  @Input()
  public pageTitle: string;

  /**
   * The foobar. Default: 'value'
   */
  @Input()
  public set foobar(value: string) {
    this._foobar = value;
  }

  public get foobar(): string {
    return this._foobar;
  }

  private _foobar: string;


  /**
   * @internal
   */
  public propertyDefinitions: {
    title: string;
    propertyDefinitions: SkyPropertyDefinition[]
  }[] = [];

  constructor(
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    this.updateTitle();

    console.log('Documentation:', documentationData);

    const moduleDef = documentationData.modules.find((m: any) => m.name === this.moduleName);

    const declarations = moduleDef.children.find((child: any) => {
      return child.type === 'declarations';
    });

    declarations.elements.forEach((declaration: any) => {
      const componentDef = documentationData.components.find((p: any) => p.name === declaration.name);
      console.log('componentDef?', componentDef);

      this.propertyDefinitions.push({
        title: `${componentDef.name} properties`,
        propertyDefinitions: componentDef.inputsClass.map((property: any) => {
          const isRequired = (
            property.defaultValue === undefined &&
            property.description &&
            property.description.indexOf('Default:') === -1
          );

          return {
            dataType: property.type,
            defaultValue: property.defaultValue,
            description: property.description,
            isRequired,
            propertyName: property.name
          };
        })
      });
    });

    console.log('Final config:', this.propertyDefinitions);

    // const providers = moduleDef.children.find((child: any) => {
    //   return child.type === 'providers';
    // });

    // providers.elements.forEach((provider: any) => {
    //   const providerDef = documentationData.injectables.find((p: any) => p.name === provider.name);
    //   console.log('eh?', providerDef);
    //   // propertyDefinitions.push({
    //   //   title: providerDef.name,
    //   //   propertyDefinitions: {
    //   //     dataType: string;
    //   //     defaultValue: string;
    //   //     isRequired: boolean;
    //   //     propertyName: string;
    //   //   }
    //   // });
    // });
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

}
