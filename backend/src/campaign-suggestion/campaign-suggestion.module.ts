import { Module } from '@nestjs/common';
import { CampaignSuggestionController } from './campaign-suggestion.controller';
import { CampaignSuggestionService } from './campaign-suggestion.service';

@Module({
  controllers: [CampaignSuggestionController],
  providers: [CampaignSuggestionService],
  exports: [CampaignSuggestionService],
})
export class CampaignSuggestionModule {}
