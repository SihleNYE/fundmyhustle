<?php

namespace Tests\Feature;

use App\Models\Campaign;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampaignFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_displays_approved_campaigns(): void
    {
        Campaign::factory()->create(['title' => 'Visible campaign', 'status' => 'approved']);
        Campaign::factory()->create(['title' => 'Pending campaign', 'status' => 'pending']);

        $this->get('/')->assertOk()->assertSee('Visible campaign')->assertDontSee('Pending campaign');
    }

    public function test_campaign_can_be_submitted_for_review(): void
    {
        $response = $this->post('/campaigns', [
            'title' => 'Solar lights for the study hall',
            'creator_name' => 'Sihle Nyendwana',
            'creator_email' => 'sihle@example.com',
            'category' => 'Community',
            'goal_amount' => 15000,
            'story' => 'We need solar lights so local learners can use the study hall safely after school during load shedding.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('campaigns', ['title' => 'Solar lights for the study hall', 'status' => 'pending']);
    }

    public function test_demo_donation_updates_campaign_totals(): void
    {
        $campaign = Campaign::factory()->create([
            'status' => 'approved', 'goal_amount' => 1000, 'raised_amount' => 100, 'donor_count' => 2,
        ]);

        $this->post(route('campaigns.donations.store', $campaign), [
            'donor_name' => 'A Backer', 'donor_email' => 'backer@example.com', 'amount' => 250,
        ])->assertRedirect();

        $this->assertDatabaseHas('donations', ['campaign_id' => $campaign->id, 'amount' => 250]);
        $this->assertDatabaseHas('campaigns', ['id' => $campaign->id, 'raised_amount' => 350, 'donor_count' => 3]);
    }
}
